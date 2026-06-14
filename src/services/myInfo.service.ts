import api from './api'

const publicPath = '/myInfo'
const adminPath = '/admin/myInfo'

export interface aboutDto {
  paragraph: About['paragraph']
}
export const aboutService = {
  getAboutMe: async (): Promise<BaseVo<About[]>> => {
    const url = `${publicPath}/about`
    return api.get(url)
  },
  editAboutMe: async (id: number, postBody: aboutDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/about/${id}`
    return api.put(url, postBody)
  },
  deleteAboutMe: async (id: number): Promise<BaseVo<void>> => {
    const url = `${adminPath}/about/${id}`
    return api.delete(url)
  },
  addAboutMe: async (postBody: aboutDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/about`
    return api.post(url, postBody)
  }
}
export interface skillDto {
  summary: CoreSkill['summary']
  details: CoreSkill['details']
}
export const coreSkillsService = {
  getCoreSkills: async (): Promise<BaseVo<CoreSkill[]>> => {
    const url = `${publicPath}/coreSkills`
    return api.get(url)
  },
  editCoreSkill: async (id: number, postBody: skillDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/coreSkills/${id}`
    return api.put(url, postBody)
  },
  deleteCoreSkill: async (id: number): Promise<BaseVo<void>> => {
    const url = `${adminPath}/coreSkills/${id}`
    return api.delete(url)
  },
  addCoreSkill: async (postBody: skillDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/coreSkills`
    return api.post(url, postBody)
  }
}

export type WorkingExpDto = Omit<WorkingExperience, 'id' | 'createTime' | 'updateTime'>
export const workingExpService = {
  getWorkingExp: async (): Promise<BaseVo<WorkingExperience[]>> => {
    const url = `${publicPath}/workingExperiences`
    return api.get(url)
  },
  editWorkingExp: async (id: number, postBody: WorkingExpDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/workingExperiences/${id}`
    return api.post(url, postBody)
  },
  deleteWorkingExp: async (id: number): Promise<BaseVo<void>> => {
    const url = `${adminPath}/workingExperiences/${id}`
    return api.delete(url)
  },
  addWorkingExp: async (postBody: WorkingExpDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/workingExperiences`
    return api.post(url, postBody)
  }
}

export type EduDto = Omit<Education, 'id'>
export const educationService = {
  getEducation: async (): Promise<BaseVo<Education[]>> => {
    const url = `${publicPath}/education`
    return api.get(url)
  },
  editEducation: async (id: number, postBody: EduDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/education/${id}`
    return api.post(url, postBody)
  },
  deleteEducation: async (id: number): Promise<BaseVo<void>> => {
    const url = `${adminPath}/education/${id}`
    return api.delete(url)
  },
  addEducation: async (postBody: EduDto): Promise<BaseVo<void>> => {
    const url = `${adminPath}/education`
    return api.post(url, postBody)
  }
}
