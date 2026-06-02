import { aboutService } from '@/services/myInfo.service'
import { useCallback, useState } from 'react'

export default function useAboutHooks() {
  const [data, setData] = useState<About[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 獲取數據
   */
  const fetchAboutMe = useCallback(async () => {
    setIsLoading(true)
    try {
      const { success, data, message } = await aboutService.getAboutMe()
      if (!success) throw new Error(message)
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
  const deleteAboutMe = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      const { success, message } = await aboutService.deleteAboutMe(id)
      if (!success) throw new Error(message)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   *  執行編輯
   */
  const editAboutMe = useCallback(async (id: number, postBody: { paragraph: About['paragraph'] }) => {
    setConfirmLoading(true)
    try {
      const { success, message } = await aboutService.editAboutMe(id, postBody)
      if (!success) throw new Error(message)
    } catch (error) {
      throw error
    } finally {
      setConfirmLoading(false)
    }
  }, [])

  /**
   *  執行添加
   */
  const addAboutMe = useCallback(async (postBody: { paragraph: About['paragraph'] }) => {
    setConfirmLoading(true)
    try {
      const { success, message } = await aboutService.addAboutMe(postBody)
      if (!success) throw new Error(message)
    } catch (error) {
      throw error
    } finally {
      setConfirmLoading(false)
    }
  }, [])

  return { data, confirmLoading, isLoading, fetchAboutMe, editAboutMe, deleteAboutMe, addAboutMe }
}
