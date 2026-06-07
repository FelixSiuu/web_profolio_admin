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
    mutationFn: (postBody: aboutDto) => aboutService.addAboutMe(postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getAboutMe'] })
    }
  })

  /**
   *  執行編輯
   */
  const { mutateAsync: editAboutMe, isPending: isEditLoading } = useMutation({
    mutationFn: ({ id, postBody }: { id: number; postBody: aboutDto }) => aboutService.editAboutMe(id, postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getAboutMe'] })
    }
  })

  /**
   * 執行刪除
   */
  const { mutateAsync: deleteAboutMe } = useMutation({
    mutationFn: (id: number) => aboutService.deleteAboutMe(id),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getAboutMe'] })
    }
  })

  const confirmLoading = isAddLoading || isEditLoading

  return { data, confirmLoading, isLoading, editAboutMe, deleteAboutMe, addAboutMe }
}
