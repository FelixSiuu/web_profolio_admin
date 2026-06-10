import api from './api'

const baseURL = 'http://localhost:3000/api/v1/myInfo'

export interface aboutDto {
  paragraph: About['paragraph']
}
export const aboutService = {
  getAboutMe: async (): Promise<BaseVo<About[]>> => {
    const url = `${baseURL}/about`
    return api.get(url)
  },
  editAboutMe: async (id: number, postBody: aboutDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/about/${id}`
    return api.put(url, postBody)
  },
  deleteAboutMe: async (id: number): Promise<BaseVo<void>> => {
    const url = `${baseURL}/about/${id}`
    return api.delete(url)
  },
  addAboutMe: async (postBody: aboutDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/about`
    return api.post(url, postBody)
  }
}
export interface skillDto {
  summary: CoreSkill['summary']
  details: CoreSkill['details']
}
export const coreSkillsService = {
  getCoreSkills: async (): Promise<BaseVo<CoreSkill[]>> => {
    const url = `${baseURL}/coreSkills`
    return api.get(url)
  },
  editCoreSkill: async (id: number, postBody: skillDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/coreSkills/${id}`
    return api.put(url, postBody)
  },
  deleteCoreSkill: async (id: number): Promise<BaseVo<void>> => {
    const url = `${baseURL}/coreSkills/${id}`
    return api.delete(url)
  },
  addCoreSkill: async (postBody: skillDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/coreSkills`
    return api.post(url, postBody)
  }
}

export type WorkingExpDto = Omit<WorkingExperience, 'id' | 'createTime' | 'updateTime'>
export const workingExpService = {
  getWorkingExp: async (): Promise<BaseVo<WorkingExperience[]>> => {
    const url = `${baseURL}/workingExperiences`
    return api.get(url)
  },
  editWorkingExp: async (id: number, postBody: WorkingExpDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/workingExperiences/${id}`
    return api.post(url, postBody)
  },
  deleteWorkingExp: async (id: number): Promise<BaseVo<void>> => {
    const url = `${baseURL}/workingExperiences/${id}`
    return api.delete(url)
  },
  addWorkingExp: async (postBody: WorkingExpDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/workingExperiences`
    return api.post(url, postBody)
  }
}

export type EduDto = Omit<Education, 'id'>
export const educationService = {
  getEducation: async (): Promise<BaseVo<Education[]>> => {
    const url = `${baseURL}/education`
    return api.get(url)
  },
  editEducation: async (id: number, postBody: EduDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/education/${id}`
    return api.post(url, postBody)
  },
  deleteEducation: async (id: number): Promise<BaseVo<void>> => {
    const url = `${baseURL}/education/${id}`
    return api.delete(url)
  },
  addEducation: async (postBody: EduDto): Promise<BaseVo<void>> => {
    const url = `${baseURL}/education`
    return api.post(url, postBody)
  }
}
