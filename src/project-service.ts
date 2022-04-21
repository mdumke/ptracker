import { Project, Projects } from './types'
import { kebabize } from './utils'

export const computeCompletion = (project: Project): number => {
  const initial = project.startValue || 0
  if (!project.updates.length) {
    return initial
  }
  const current = project.updates[project.updates.length - 1].value
  return Math.round(((initial - current) / (initial - project.target)) * 100)
}

export const findIdLike = (projects: Projects, pattern: string): string => {
  const kPattern = kebabize(pattern)
  const matches = Object.keys(projects).filter(key => key.includes(kPattern))

  if (!matches.length) {
    throw new Error(`Could not find id matching pattern "${pattern}"`)
  }

  if (matches.length > 1) {
    throw new Error(
      `Ambiguous pattern. More than one project found:\n\n - ${matches.join(
        '\n - '
      )}\n`
    )
  }

  return matches[0]
}

export const listProjects = (projects: Projects, all?: boolean): Project[] => {
  const byCreatedAt = (p1: Project, p2: Project) =>
    p1.createdAt.getTime() - p2.createdAt.getTime()

  return Object.keys(projects)
    .reduce((res: Project[], id: string) => {
      return all || !projects[id].archived ? [...res, projects[id]] : res
    }, [])
    .sort(byCreatedAt)
}

const getProject = (projects: Projects, id: string): Project => {
  if (!projects.hasOwnProperty(id)) {
    throw new Error(`Project "${id}" not found`)
  }
  return projects[id]
}

export const buildProject = (data: {
  title: string
  target: string,
  startValue?: string
}): Project => {
  const target = parseFloat(data.target)

  if (isNaN(target)) {
    throw new Error(`Could not convert ${data.target} to number`)
  }

  const project: Project = {
    id: kebabize(data.title),
    title: data.title,
    target,
    createdAt: new Date(),
    updatedAt: new Date(),
    updates: []
  }

  if (data.startValue) {
    const val = parseFloat(data.startValue)

    if (isNaN(val)) {
      throw new Error(`Could not convert ${data.startValue} to number`)
    }

    project.startValue = val
  }

  return project
}

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
  value: string
): Projects => {
  const val = parseFloat(value)

  return {
    ...projects,
    [id]: addUpdate(getProject(projects, id), val)
  }
}

export const archiveProject = (projects: Projects, id: string): Projects => ({
  ...projects,
  [id]: {
    ...getProject(projects, id),
    archived: true
  }
})
