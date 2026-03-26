export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
})

export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
})

export const useLocalSearchParams = () => ({})
export const useGlobalSearchParams = () => ({})
export const useSegments = () => []
export const usePathname = () => '/sign-in'

export const Stack = ({ children }: { children: React.ReactNode }) => children
