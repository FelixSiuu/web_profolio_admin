import { useCallback, useState } from 'react'
import { coreSkillsService, skillDto } from '@/services/myInfo.service'

export default function useSkillsHooks() {
  const [data, setData] = useState<CoreSkill[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 獲取數據
   */
  const fetchCoreSkills = useCallback(async () => {
    setIsLoading(true)
    try {
      const { isSuccess, data, message } = await coreSkillsService.getCoreSkills()
      if (!isSuccess) throw new Error(message)
      setData(data)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 執行刪除
   */
  const deleteCoreSkill = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      const { isSuccess, message } = await coreSkillsService.deleteCoreSkill(id)
      if (!isSuccess) throw new Error(message)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   *  執行編輯
   */
  const editCoreSkill = useCallback(async (id: number, postBody: skillDto) => {
    setConfirmLoading(true)
    try {
      const { isSuccess, message } = await coreSkillsService.editCoreSkill(id, postBody)
      if (!isSuccess) throw new Error(message)
    } catch (error) {
      throw error
    } finally {
      setConfirmLoading(false)
    }
  }, [])

  /**
   *  執行添加
   */
  const addCoreSkill = useCallback(async (postBody: skillDto) => {
    setConfirmLoading(true)
    try {
      const { isSuccess, message } = await coreSkillsService.addCoreSkill(postBody)
      if (!isSuccess) throw new Error(message)
    } catch (error) {
      throw error
    } finally {
      setConfirmLoading(false)
    }
  }, [])

  return {
    data,
    confirmLoading,
    isLoading,
    fetchCoreSkills,
    deleteCoreSkill,
    editCoreSkill,
    addCoreSkill
  }
}
