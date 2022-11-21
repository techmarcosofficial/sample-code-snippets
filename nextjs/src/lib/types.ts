export interface ResponseProps {
  posts?: object,
  post?: object,
  categories?: object,
  category?: object,
  pages?: object,
  page?: object,
  menus?: object,
  menu?: object,
}

export interface LayoutProps {
  title: string,
  header: boolean,
  children?: React.ReactNode,
}

export interface HeaderProps {
  title: string,
}

export interface AuthState {
  user: UserProps | null,
  token: string | null,
  isLoggedIn: boolean,
  updateUser: (e: UserProps) => void,
  login: (response: UserResponseProps) => void,
  logout: () => void,
}

export interface APIRequestOptionProps {
  method?: string,
  headers?: {
    Authorization?: string,
    'Content-Type'?: string,
  },
  body?: any,
}

export interface UserResponseProps {
  user: UserProps,
  token: string,
}

export interface UserProps {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  email_verified_at: string,
  display_name: string,
  image: string,
  thumb: string,
  status: string,
  trending: number,
  description: string,
  role: {
    name: string,
  },
  created_at: string,
  updated_at: string,
}
export interface TopicOverviewProps {
  id: number,
  title: string,
  slug: string,
  type: string,
  content: string,
  image: string,
  thumb: string,
  organization_id: number,
  vendor_id: number,
  category_id: number,
  status: string,
  docs: [ContentDocProps],
  created_at: string,
  updated_at: string,
}

export interface ContentDocProps {
  id: number,
  status: number,
  article_id: number,
  file: string,
  thumb: string,
  created_at: string,
  updated_at: string,
  deleted_at: string,
}

export interface RecommendedContentProps {
  id: number,
  slug: string,
  type: string,
  organization_id: number,
  vendor_id: number,
  category_id: number,
  title: string,
  content: string,
  presenter: string,
  external_link: string,
  image: string,
  thumb: string,
  status: string,
  docs: [ContentDocProps],
  created_at: string,
  updated_at: string,
}

export interface QuestionAnswerProps {
  id: number,
  slug: string,
  type: string,
  user_id: number,
  category_id: number,
  question: string,
  answer: string,
  image: string,
  thumb: string,
  status: string,
  created_at: string,
  updated_at: string,
}

export interface CriteriaProps {
  id: number,
  title: string,
  type: string,
  image: string,
  thumb: string,
  user_id: number,
  category_id: number,
  question: string,
  answer: string,
  question_answer: string,
  description: string,
  record_for: string,
  status: string,
  created_at: string,
  updated_at: string,
}

export interface UserDropdownProps {
  user: UserProps | null,
  logoutHandler: () => void,
}

export interface HomePageProps {
  token?: string,
  slides: [SlidesCategories],
  featuredCategories: [CategoryProps],
  latestFeedbacks: [FeedbackProps],
  trendingVendors: [VendorProps]
}

export interface HomeCarouselProps {
  items: [SlidesCategories]
}

export interface FeedbackProps {
  id: number,
  title: string,
  category_id: number,
  category_image: string,
  category_name: string,
  category_slug: string,
  category_thumb: string,
  feedback: string,
  feedback_image: string,
  feedback_thumb: string,
  is_featured: boolean,
  liked_by_curent_user: string,
  no_of_likes: number,
  no_of_comments: number,
  feedback_for: string,
  organization_id: number,
  organization_image: string,
  organization_name: string,
  organization_thumb: string,
  vendor_id: number,
  vendor_name: string,
  vendor_slug: string,
  vendor_image: string,
  vendor_thumb: string,
  created_at: string,
  openComment?: boolean,
  showComments?: boolean,
  toggleCommentTitle?: boolean,
}

export interface SlidesCategories {
  id: number,
  name: string,
  slug: string,
  image: string,
  description: string,
  is_featured: number,
  is_slide: number,
  parent_id: number,
  status: boolean
  thumb: string,
  type: string,
  user_id: number,
  created_at: string,
  updated_at: string,
  deleted_at: string,
}

export interface CategoryDetailProps {
  item: CategoryProps,
}

export interface CategoriesProps {
  current_page: number,
  data: [CategoryProps],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: [LinkProps],
  next_page_url?: string | null,
  path: string,
  per_page: number,
  prev_page_url?: string | null,
  to: number,
  total: number,
}

export interface CategoryProps {
  id: number,
  name: string,
  description: string,
  image: string,
  slug: string,
  type: string,
  thumb: string,
  user_id: number,
  parent_id: number,
  status: number,
  options: {
    BusinessModel: [{ id: number, name: string, type: string }],
    Basic: [{ id: number, name: string, type: string }],
    ClientBase: [{ id: number, name: string, type: string }],
    Pricing: [{ id: number, name: string, type: string }],
    Modality: [{ id: number, name: string, type: string }],
    Service: [{ id: number, name: string, type: string }],
  }
}

export interface VendorsProps {
  current_page: number,
  data: [VendorProps],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: [LinkProps],
  next_page_url?: string | null,
  path: string,
  per_page: number,
  prev_page_url?: string | null,
  to: number,
  total: number,
}

export interface VendorProps {
  id: number,
  first_name: string,
  last_name: string,
  display_name: string,
  email: string,
  description: string,
  slug: string,
  image: string,
  thumb: string,
  trending: number,
  status: string,
  reviewed_by_pbgh: number,
  selected?: boolean,
  created_at: string,
  updated_at: string,
}

export interface LinkProps {
  url: string | null,
  label: string,
  active: boolean,
}

export interface ResetPasswordProps {
  token: string,
  password: string,
  confirm_password: string,
}

export interface ChangePasswordProps {
  current_password: string,
  password: string,
  confirm_password: string,
}

export interface ResetPasswordModalProps {
  token: string | null,
  open: boolean,
  handleModal: (e: boolean) => void,
}

export interface UpdateProfileProps {
  display_name: string,
  description?: string,
  profile_image?: File,
}

export interface CategoriesListProps {
  items: CategoriesProps
}

export interface FeaturedCategoriesProps {
  categories: [CategoryProps]
}

export interface CategoryItems {
  id: 1
  name: string,
  image: string,
  description: string,
  is_featured: number,
  status: number,
  thumb: string,
  updated_at: string,
  user_id: number,
  parent_id: number,
  created_at: string,
  deleted_at: string,
}

export interface ContactModalProps {
  open: boolean,
  handleModal: (e: boolean) => void,
}

export interface ReviewModalProps {
  id: number,
  name: string,
  description: string,
  image: string,
  type: string,
  open: boolean,
  handleModal: (e: boolean) => void,
}

export interface CategoriesPageProps {
  items?: CategoriesProps,
  item?: CategoryProps
}

export interface VendorsPageProps {
  items?: VendorsProps,
  item?: VendorDetailProps
}

export interface ThirdPartyInfoProps {
  current_page: number,
  data: [ThirdPartyInfoDataProps],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: [LinkProps],
  next_page_url?: string | null,
  path: string,
  per_page: number,
  prev_page_url?: string | null,
  to: number,
  total: number,
}

export interface ThirdPartyInfoDataProps {
  id: number,
  title: string,
  content: string,
  image: string,
  category_id: number,
  organization_id: number,
  slug: string,
  status: number,
  thumb: string,
  type: string,
  updated_at: string,
  vendor_id: number,
  created_at: string,
  deleted_at: string,
  external_link: string,
}

export interface VendorCommunityFeedbacksProps {
  current_page: number,
  data: [VendorCommunityFeedbacksDataProps],
  first_page_url: string,
  from: number,
  last_page: 1
  last_page_url: string,
  links: [],
  next_page_url: string,
  path: string,
  per_page: number,
  prev_page_url: string,
  to: number,
  total: number,
}

export interface VendorCommunityFeedbacksDataProps {
  id: number,
  title: string,
  feedback: string,
  image: string,
  category_id: number,
  created_at: string,
  deleted_at: string,
  is_featured: boolean,
  organization: UserProps,
  status: boolean,
  thumb: string,
  updated_at: string,
  user_id: number,
  vendor_id: number,
}

export interface VendorDetailProps {
  id: number,
  display_name: string,
  first_name: string,
  last_name: string,
  email: string,
  image: string,
  description: string,
  email_verified_at: string,
  options: {
    BusinessModel: [{ id: number, name: string, type: string }],
    Basic: [{ id: number, name: string, type: string }],
    ClientBase: [{ id: number, name: string, type: string }],
    Pricing: [{ id: number, name: string, type: string }],
    Modality: [{ id: number, name: string, type: string }],
    Service: [{ id: number, name: string, type: string }],
  }
  reviewed_by_pbgh: boolean,
  role: { name: string },
  slug: string,
  status: string,
  thumb: string,
  trending: number,
  created_at: string,
  updated_at: string,
  // business_models: [],
  // client_bases: [],
  // conditions_covereds: [],
  // created_at: string,
  // description: string,
  // display_name: string,
  // email: string,
  // email_verified_at: string,
  // first_name: string,
  // id: number,
  // image: string,
  // integration_capabilities: [],
  // last_name: string,
  // modalities: [],
  // provider_staffings: [],
  // referral_sources: [],
  // reviewed_by_pbgh: number,
  // role: {name: string}
  // services: []
  // status: string,
  // thumb: string,
  // trending: number,
  // updated_at: string,
  // vendor_sections: []
}

export interface VendorQAProps {
  current_page: number,
  data: [VendorQADataProps],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: [LinkProps],
  next_page_url?: string | null,
  path: string,
  per_page: number,
  prev_page_url?: string | null,
  to: number,
  total: number,
}

export interface VendorQADataProps {
  answer: string,
  category_id: number,
  created_at: string,
  deleted_at: string,
  id: number,
  image: string,
  question: string,
  record_for: string,
  status: number,
  thumb: string,
  type: string,
  updated_at: string,
  user_id: number,
}

export interface VendorsListProps {
  items: VendorsProps | null,
  currentVendorId: number | null,
}

export interface NewVendorsProps {
  items: [VendorProps]
}

export interface TrendingVendorsProps {
  vendors: [VendorProps]
}

export interface VendorDetailPageProps {
  item: VendorDetailProps,
}

export interface VendorLogoProps {
  image: string,
}

export interface ActionsProps {
  type: string,
  item: VendorDetailProps
}

export interface VendorInfoProps {
  item: VendorDetailProps
}

export interface VendorDetail {
  id: number,
  display_name: string,
  description: string,
}

export interface PaginationProps {
  current_page?: number,
  last_page?: number,
  from?: number,
  to?: number,
  first_page_url?: string,
  next_page_url?: string | null,
  prev_page_url?: string | null,
  total?: number,
  items_per_page?: number,
}

// export interface SearchPageProps {
//   query: string,
//   searchType: string,
//   categories: CategoriesProps,
//   vendors: VendorsProps,
// }

export interface SearchPageProps {
  query: string,
  category: string,
}

export interface AdminSearchProps {
  query: string,
  category: string,
}

export interface BreadcrumbProps {
  items: Array<BreadcrumbItemProps>
}

export interface BreadcrumbItemProps {
  label: string,
  path: string,
}

export interface NavbarCategories {
  id: string,
  name: string,
  slug: string,
}

export interface SearchCategoriesProps {
  id: number,
  name: string,
  slug: string,
  image: string,
  thumb: string,
  description: string,
}

export interface OptionsProps {
  name: string,
  items: [OptionProps];
}

export interface OptionProps {
  id: number,
  name: string,
  slug?: string,
  type: string,
  selected?: boolean,
}

export interface SelectedFeedbackProps {
  id: number;
  type: string;
  name: string;
  description: string;
  image: string;
}

export interface FeedbackCommentsComponentProps {
  comments: FeedbackCommentProps[]
}

export interface FeedbackCommentProps {
  id: number,
  name: string;
  image: string;
  role: string;
  feedback_for: string;
  feedback: string;
}

export interface AddCommentProps {
  feedbacks: FeedbackProps[],
  selectedFeedback: FeedbackProps,
  feedbackComments: FeedbackCommentProps[],
  setLatesetFeedbacks: (e: FeedbackProps[]) => void,
  setFeedbackComments: (e: FeedbackCommentProps[]) => void,
}

export interface AutoCompleteProps {
  name: string,
  vendorIds: number[],
  categoryIds: number[],
  handleSearch: (n: string, e: any, t: number | null) => void,
}

export interface AutoCompleteVendorsProps {
  id: number,
  display_name: string,
  slug: string,
  description: string,
  key: string,
  reviewed_by_pbgh: number,
  image: string,
  thumb: string,
  selected?: boolean 
}

export interface FeedbacksComponentProps {
  loading: boolean,
  items: FeedbackProps[],
  comments: FeedbackCommentProps[],
  handleLikes: (id: number) => void,
  handleComments: (e: FeedbackProps) => void,
  showComments: (e: FeedbackProps) => void,
  setLatesetFeedbacks: (e: FeedbackProps[]) => void,
  setFeedbackComments: (e: FeedbackCommentProps[]) => void,
}

