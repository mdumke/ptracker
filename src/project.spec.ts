import { expect } from 'chai'
import {
  addProject,
  buildProject,
  updateProject,
  archiveProject
} from './project'

describe('buildProject', () => {
  it('stores given data', () => {
    const p1 = buildProject({ title: 'Project 1', target: 10 })
    expect(p1.title).to.equal('Project 1')
    expect(p1.target).to.equal(10)
  })

  it('creates an id from the title', () => {
    const p1 = buildProject({ title: 'Project 1', target: 10 })
    expect(p1.id).to.equal('project-1')
  })
})

describe('addProject', () => {
  it('adds a project using its id', () => {
    const project = buildProject({ title: 'p1', target: 10 })
    const projects = addProject({}, project)
    expect(projects.p1).to.equal(project)
  })

  it('fails when the projects id already exists', () => {
    const project = buildProject({ title: 'P 1', target: 10 })
    expect(() => addProject({ [project.id]: project }, project)).to.throw()
  })
})

describe('updateProject', () => {
  it('appends a first update', () => {
    const project = buildProject({ title: 'p1', target: 10 })
    const projects = addProject({}, project)
    const nextProjects = updateProject(projects, 'p1', 2)
    const updates = nextProjects[project.id].updates
    expect(updates.length).to.eq(1)
    expect(updates[0].value).to.eq(2)
  })

  it('fails when the project is not found', () => {
    expect(() => updateProject({}, '123', 20)).to.throw()
  })
})

describe('archiveProject', () => {
  it('sets the archive flag on a given project', () => {
    const project = buildProject({ title: 'P1', target: 10 })
    const projects = addProject({}, project)
    const nextProjects = archiveProject(projects, project.id)
    expect(nextProjects[project.id].archived).to.equal(true)
  })

  it('fails if the project does not exist', () => {
    expect(() => archiveProject({}, '123')).to.throw()
  })
})
