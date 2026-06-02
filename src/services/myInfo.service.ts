import api from './api'

const baseURL = 'http://localhost:3000/api/v1/myInfo'

export const aboutService = {
  getAboutMe: async (): Promise<BaseVo<About[]>> => {
    const url = `${baseURL}/about`
    return api.get(url)
  },
  editAboutMe: async (id: number, postBody: { paragraph: About['paragraph'] }): Promise<BaseVo<void>> => {
    const url = `${baseURL}/about/${id}`
    return api.put(url, postBody)
  }
}

export const workingExpService = {
  getWorkingExp: async (): Promise<BaseVo<WorkingExperience[]>> => {
    const url = `${baseURL}/workingExperiences`
    return api.get(url)
  }
}

export const coreSkillsService = {
  getCoreSkills: async (): Promise<BaseVo<CoreSkill[]>> => {
    const url = `${baseURL}/coreSkills`
    return api.get(url)
  }
}

export const educationService = {
  getEducation: async (): Promise<BaseVo<Education[]>> => {
    const url = `${baseURL}/education`
    return api.get(url)
  }
}
