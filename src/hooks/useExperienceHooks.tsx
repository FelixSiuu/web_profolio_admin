import { WorkingExpDto, workingExpService } from '@/services/myInfo.service'
import { useCallback, useState } from 'react'

export default function useExperienceHooks() {
  const [data, setData] = useState<WorkingExperience[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 獲取數據
   */
  const fetchWorkingExp = useCallback(async () => {
    setIsLoading(true)
    try {
      const { isSuccess, data, message } = await workingExpService.getWorkingExp()
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
  const deleteWorkingExp = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      const { isSuccess, message } = await workingExpService.deleteWorkingExp(id)
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
  const editWorkingExp = useCallback(async (id: number, postBody: WorkingExpDto) => {
    setConfirmLoading(true)
    try {
      const { isSuccess, message } = await workingExpService.editWorkingExp(id, postBody)
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
  const addWorkingExp = useCallback(async (postBody: WorkingExpDto) => {
    setConfirmLoading(true)
    try {
      const { isSuccess, message } = await workingExpService.addWorkingExp(postBody)
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
    fetchWorkingExp,
    deleteWorkingExp,
    editWorkingExp,
    addWorkingExp
  }
}
