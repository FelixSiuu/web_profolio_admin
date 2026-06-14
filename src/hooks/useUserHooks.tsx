import { LoginDto, RegisterDto, userService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useUserHooks() {
  const queryClient = useQueryClient()

  /**
   * 獲取驗證碼
   */
  const { data: captchaImgUrl = '', isFetching: isFetchingCaptcha } = useQuery({
    queryKey: ['getCaptcha'],
    queryFn: async () => {
      const { isSuccess, data, message } = await userService.getCaptcha()
      if (!isSuccess) throw new Error(message)
      return data
    }
  })

  /**
   * 重新獲取驗證碼
   */
  const refreshCaptcha = () =>
    queryClient.invalidateQueries({
      queryKey: ['getCaptcha']
    })

  /**
   * 登錄
   */
  const { mutateAsync: login, isPending: isPendingLogin } = useMutation({
    mutationFn: async (postBody: LoginDto) => {
      const { isSuccess, data, message } = await userService.login(postBody)
      if (!isSuccess) throw new Error(message)
      return data
    },
    onSuccess: (data) => {
      return data
    }
  })

  /**
   * 註冊
   */
  const { mutateAsync: register, isPending: isPendingRegister } = useMutation({
    mutationFn: async (postBody: RegisterDto) => {
      const { isSuccess, message } = await userService.register(postBody)
      if (!isSuccess) throw new Error(message)
    }
  })

  return {
    captchaImgUrl,
    isFetchingCaptcha,
    isPendingLogin,
    isPendingRegister,
    refreshCaptcha,
    login,
    register
  }
}
