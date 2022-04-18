import { Project, Projects } from './types'
import { kebabize } from './utils'

const getProject = (projects: Projects, id: string): Project => {
  if (!projects.hasOwnProperty(id)) {
    throw new Error(`Project "${id}" not found`)
  }
  return projects[id]
}

const buildProject = (data: { title: string; target: number }): Project => ({
  ...data,
  id: kebabize(data.title),
  createdAt: new Date(),
  updatedAt: new Date(),
  updates: []
})

export const addProject = (projects: Projects, project: Project): Projects => {
  if (projects[project.id]) {
    throw new Error(`"${project.title}" (${project.id}) already exists`)
  }

  return {
    ...projects,
    [project.id]: project
  }
}

export const addUpdate = (project: Project, value: number): Project => {
  return {
    ...project,
    updates: [
      ...project.updates,
      {
        value,
        createdAt: new Date()
      }
    ]
  }
}

export const updateProject = (
  projects: Projects,
  id: string,
  value: number
): Projects => ({
  ...projects,
  [id]: addUpdate(getProject(projects, id), value)
})

export const archiveProject = (projects: Projects, id: string): Projects => ({
  ...projects,
  [id]: {
    ...getProject(projects, id),
    archived: true
  }
})

export { buildProject }
