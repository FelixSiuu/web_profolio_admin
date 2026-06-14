import { aboutDto, aboutService } from '@/services/myInfo.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useAboutHooks() {
  const queryClient = useQueryClient()

  /**
   * 獲取數據
   */
  const { data = [], isLoading } = useQuery({
    queryKey: ['getAboutMe'],
    queryFn: async () => {
      const { isSuccess, data, message } = await aboutService.getAboutMe()
      if (!isSuccess) throw new Error(message)
      return data
    }
  })

  /**
   *  執行添加
   */
  const { mutateAsync: addAboutMe, isPending: isAddLoading } = useMutation({
    mutationFn: async (postBody: aboutDto) => {
      const { isSuccess, message } = await aboutService.addAboutMe(postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAboutMe'] })
    }
  })

  /**
   *  執行編輯
   */
  const { mutateAsync: editAboutMe, isPending: isEditLoading } = useMutation({
    mutationFn: async ({ id, postBody }: { id: number; postBody: aboutDto }) => {
      const { isSuccess, message } = await aboutService.editAboutMe(id, postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAboutMe'] })
    }
  })

  /**
   * 執行刪除
   */
  const { mutateAsync: deleteAboutMe, isPending: isDeleteLoading } = useMutation({
    mutationFn: async (id: number) => {
      const { isSuccess, message } = await aboutService.deleteAboutMe(id)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAboutMe'] })
    }
  })

  const confirmLoading = isAddLoading || isEditLoading || isDeleteLoading

  return { data, confirmLoading, isLoading, editAboutMe, deleteAboutMe, addAboutMe }
}
