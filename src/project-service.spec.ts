import { expect } from 'chai'
import {
  addProject,
  archiveProject,
  buildProject,
  computeCompletion,
  findIdLike,
  listProjects,
  updateProject
} from './project-service'

describe('computeCompletion', () => {
  it('returns 0 if there a no updates', () => {
    const p = buildProject({ title: 'project', target: '10' })
    expect(computeCompletion(p)).to.equal(0)
  })

  it('handles a single value correctly', () => {
    const p = buildProject({ title: 'project', target: '10' })
    p.updates.push({
      value: 5,
      createdAt: new Date()
    })
    expect(computeCompletion(p)).to.equal(50)
  })
})

describe('findIdLike', () => {
  it('fails if no matching id is found', () => {
    expect(() => findIdLike({}, 'abc')).to.throw()
  })

  it('returns a single exact title match', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const projects = addProject({}, p1)
    expect(findIdLike(projects, 'Project 1')).to.eql(p1.id)
  })

  it('returns a single partial match', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const projects = addProject({}, p1)
    expect(findIdLike(projects, 'oject')).to.eql(p1.id)
  })

  it('fails if more than one key matches', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const p2 = buildProject({ title: 'Project 2', target: '10' })
    const projects = {
      [p1.id]: p1,
      [p2.id]: p2
    }
    expect(() => findIdLike(projects, 'oject')).to.throw()
  })

  it('does not ignore archived projects by default', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const p2 = buildProject({ title: 'Project 2', target: '10' })
    let projects = {
      [p1.id]: p1,
      [p2.id]: p2
    }
    projects = archiveProject(projects, p1.id)
    expect(() => findIdLike(projects, 'oject')).to.throw()
  })

  it('can ignore archived projects', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const p2 = buildProject({ title: 'Project 2', target: '10' })
    let projects = {
      [p1.id]: p1,
      [p2.id]: p2
    }
    projects = archiveProject(projects, p1.id)
    expect(findIdLike(projects, 'oject', true)).to.eql(p2.id)
  })
})

describe('listProjects', () => {
  it('returns an empty array if there are no projects', () => {
    expect(listProjects({})).to.eql([])
  })

  it('returns a single project in an array', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const projects = addProject({}, p1)
    expect(listProjects(projects)).to.eql([p1])
  })

  it('sorts multiple projects by creation date', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const p2 = buildProject({ title: 'Project 2', target: '10' })
    const p3 = buildProject({ title: 'Project 3', target: '10' })
    p1.createdAt = new Date('2022-01-03')
    p2.createdAt = new Date('2022-01-01')
    p3.createdAt = new Date('2022-01-02')
    const projects = {
      [p1.id]: p1,
      [p2.id]: p2,
      [p3.id]: p3
    }
    expect(listProjects(projects)).to.eql([p2, p3, p1])
  })

  it('filters out archived projects', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const p2 = buildProject({ title: 'Project 2', target: '10' })
    p1.archived = true
    const projects = {
      [p1.id]: p1,
      [p2.id]: p2
    }
    expect(listProjects(projects)).to.eql([p2])
  })

  it('can return all projects if necessary', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    const p2 = buildProject({ title: 'Project 2', target: '10' })
    p1.archived = true
    const projects = {
      [p1.id]: p1,
      [p2.id]: p2
    }
    expect(listProjects(projects, true)).to.eql([p1, p2])
  })
})

describe('buildProject', () => {
  it('stores given data', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    expect(p1.title).to.equal('Project 1')
    expect(p1.target).to.equal(10)
  })

  it('creates an id from the title', () => {
    const p1 = buildProject({ title: 'Project 1', target: '10' })
    expect(p1.id).to.equal('project-1')
  })

  it('fails if target is not numeric', () => {
    expect(() => buildProject({ title: 'Project 1', target: 'x' })).to.throw()
  })

  it('handles an optional startValue', () => {
    const p1 = buildProject({
      title: 'Project 1',
      target: '10',
      startValue: '2.5'
    })
    expect(p1.startValue).to.equal(2.5)
  })

  it('fails if startValue is not a number', () => {
    expect(() => buildProject({
      title: 'Project 1',
      target: '10',
      startValue: 'a'
    })).to.throw()
  })
})

describe('addProject', () => {
  it('adds a project using its id', () => {
    const project = buildProject({ title: 'p1', target: '10' })
    const projects = addProject({}, project)
    expect(projects.p1).to.equal(project)
  })

  it('fails when the projects id already exists', () => {
    const project = buildProject({ title: 'P 1', target: '10' })
    expect(() => addProject({ [project.id]: project }, project)).to.throw()
  })
})

describe('updateProject', () => {
  it('appends a first update', () => {
    const project = buildProject({ title: 'p1', target: '10' })
    const projects = addProject({}, project)
    const nextProjects = updateProject(projects, 'p1', '2')
    const updates = nextProjects[project.id].updates
    expect(updates.length).to.eq(1)
    expect(updates[0].value).to.eq(2)
  })

  it('fails when the project is not found', () => {
    expect(() => updateProject({}, '123', '20')).to.throw()
  })
})

describe('archiveProject', () => {
  it('sets the archive flag on a given project', () => {
    const project = buildProject({ title: 'P1', target: '10' })
    const projects = addProject({}, project)
    const nextProjects = archiveProject(projects, project.id)
    expect(nextProjects[project.id].archived).to.equal(true)
  })

  it('fails if the project does not exist', () => {
    expect(() => archiveProject({}, '123')).to.throw()
  })
})
