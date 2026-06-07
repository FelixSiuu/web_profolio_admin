import { coreSkillsService, skillDto } from '@/services/myInfo.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useSkillsHooks() {
  const queryClient = useQueryClient()

  // 🎯 1. 獲取數據 (Read)
  const {
    data = [], // 預設空陣列，對齊原本的 useState 初始值
    isLoading
  } = useQuery({
    queryKey: ['getCoreSkills'],
    queryFn: async () => {
      const { isSuccess, data, message } = await coreSkillsService.getCoreSkills()
      if (!isSuccess) throw new Error(message)
      return data
    }
  })

  // 🎯 2. 執行添加 (Create)
  const { mutateAsync: addCoreSkill, isPending: isAddLoading } = useMutation({
    mutationFn: (postBody: skillDto) => coreSkillsService.addCoreSkill(postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      // 🔥 關鍵：通知這把鑰匙的快取失效，Table 會在背景無感自動重新撈取最新數據
      queryClient.invalidateQueries({ queryKey: ['getCoreSkills'] })
    }
  })

  // 🎯 3. 執行編輯 (Update)
  const { mutateAsync: editCoreSkill, isPending: isEditLoading } = useMutation({
    mutationFn: ({ id, postBody }: { id: number; postBody: skillDto }) => coreSkillsService.editCoreSkill(id, postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getCoreSkills'] })
    }
  })

  // 🎯 3. 執行刪除 (Delete)
  const { mutateAsync: deleteCoreSkill } = useMutation({
    mutationFn: (id: number) => coreSkillsService.deleteCoreSkill(id),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getCoreSkills'] })
    }
  })

  // 🎯 5. 整合原本的 Loading 狀態，確保外部引用的變數名稱不變
  const confirmLoading = isAddLoading || isEditLoading

  return {
    data,
    confirmLoading,
    isLoading,
    deleteCoreSkill,
    editCoreSkill,
    addCoreSkill
  }
}
