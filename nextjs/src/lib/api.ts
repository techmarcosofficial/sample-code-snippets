import {
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  UPDATE_PROFILE,
  CATEGORY_SLIDES,
  FEATURED_CATEGORIES,
  NAVBAR_CATEGORIES,
  CATEGORIES,
  VENDORS,
  NEW_VENDORS,
  TRENDING_VENDORS,
  SAVE_FEEDBACK,
  LATEST_FEEDBACKS,
  FEEDBACK_LIKE,
  FEEDBACKS,
  CONTACT,
  FILTERS,
  SEARCH_CATEGORIES,
  SEARCH_VENDORS,
  VENDOR_FEEDBACKS,
  CATEGORY_FEEDBACKS,
} from './api_routes';

import {
  ResetPasswordProps,
  ChangePasswordProps,
  APIRequestOptionProps
} from '../lib/types';

const fetchPostAPI = async (
  url: string,
  type: string,
  body: any,
  token: string | null = null,
  requestType: string = 'json'
) => {
  try {
    let header = {};
    if (token) {
      header = { ...header, Authorization: `Bearer ${token}` };
    }
    if (requestType === 'json') {
      header = { ...header, 'Content-Type': 'application/json' };
    }
    let options: APIRequestOptionProps = {};
    options = {
      ...options,
      method: type ? type : 'POST',
      headers: {
        ...header,
      },
      body: (
          requestType === 'form-data'
        ) ? body : JSON.stringify(body),
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, options);
    // Convert response in JSON format.
    const json = await res.json();
    // if (json.errors) {
    //   throw new Error('Failed to fetch API');
    // }
    return json;
  } catch (err) {
    return err;
  }
}

const fetchAPI = async (url: string, token: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (res.ok) {
      // Convert response in JSON format.
      return await res.json();
    }
    // if (json.errors) {
    //   throw new Error('Failed to fetch API');
    // }
    return res;
  } catch (err) {
    return err;
  }
}

export const loginAPI = async (email: string, password: string) => {
  return await fetchPostAPI(LOGIN, 'POST', { email, password });
}

export const forgotPasswordAPI = async (email: string) => {
  return await fetchPostAPI(FORGOT_PASSWORD, 'POST', { email });
}

export const resetPasswordAPI = async (payload: ResetPasswordProps) => {
  return await fetchPostAPI(RESET_PASSWORD, 'POST', { payload });
}

export const changePasswordAPI = async (payload: ChangePasswordProps, token: string) => {
  return await fetchPostAPI(
    CHANGE_PASSWORD,
    'POST',
    {
      current_password: payload.current_password,
      password: payload.password,
      confirm_password: payload.confirm_password,
    },
    token,
  );
}

export const updateProfileAPI = async (payload: any, token: string) => {
  return await fetchPostAPI(
    UPDATE_PROFILE,
    'POST',
    payload,
    token,
    'form-data'
  );
}

export const getCategories = async (token: string, query?: any) => {
  let url = CATEGORIES;
  if (query?.q) {
    url = `${url}?key=${query?.q}`;
  }
  if (query?.page) {
    url = `${url}?page=${query?.page}`;
  }
  return await fetchAPI(url, token);
}

export const getCategoryById = async (id: string, token: string) => {
  return await fetchAPI(`${CATEGORIES}/${id}`, token);
}

export const getSlides = async (token: string) => {
  return await fetchAPI(CATEGORY_SLIDES, token);
}

export const getFeaturedCategories = async (token: string) => {
  return await fetchAPI(FEATURED_CATEGORIES, token);
}

export const getNavbarCategories = async (token: string) => {
  return await fetchAPI(NAVBAR_CATEGORIES, token);
}

export const getNewVendors = async (token: string) => {
  return await fetchAPI(NEW_VENDORS, token);
}

export const getLatestFeedbacks = async (token: string) => {
  return await fetchAPI(LATEST_FEEDBACKS, token);
}

export const getTrendingVendors = async (token: string) => {
  return await fetchAPI(TRENDING_VENDORS, token);
}

export const getCategoryOverview = async (id: string | number, token: string) => {
  return await fetchAPI(`${CATEGORIES}/${id}/topic-overview`, token);
}

export const getCategoryRecommendedContents = async (id: string | number, token: string) => {
  return await fetchAPI(`${CATEGORIES}/${id}/recommended-contents`, token);
}

export const getCategoryQuestionAnswers = async (id: string | number, token: string) => {
  return await fetchAPI(`${CATEGORIES}/${id}/question-answers`, token);
}

export const getCategoryCriterias = async (id: string | number, token: string) => {
  return await fetchAPI(`${CATEGORIES}/${id}/criterias`, token);
}
export const getVendorCriterias = async (id: string | number, token: string) => {
  return await fetchAPI(`${VENDORS}/${id}/criterias`, token);
}

export const getVendors = async (token: string, query?: any) => {
  let url = VENDORS;
  if (query?.q) {
    url = `${url}?key=${query?.q}`;
  }
  if (query?.page) {
    url = `${url}?page=${query?.page}`;
  }
  return await fetchAPI(url, token);
}

export const getVendorById = async (id: string, token: string) => {
  return await fetchAPI(`${VENDORS}/${id}`, token);
}

export const getCommunityFeedbacks = async (id: string | number, token: string) => {
  return await fetchAPI(`${VENDORS}/${id}/community-feedbacks`, token);
}

export const getVendorQuestionAnswers = async (id: string | number, token: string) => {
  return await fetchAPI(`${VENDORS}/${id}/question-answers`, token);
}

export const getThirdPartyInfo = async (id: string | number, token: string) => {
  return await fetchAPI(`${VENDORS}/${id}/third-party-info`, token);
}

export const contactAPI = async (payload: any, token: string) => {
  return await fetchPostAPI(CONTACT, 'POST', payload, token);
}

export const feedbackAPI = async (payload: any, token: string) => {
  return await fetchPostAPI(SAVE_FEEDBACK, 'POST', payload, token, 'form-data');
}

export const likeAPI = async (payload: any, token: string) => {
  return await fetchPostAPI(FEEDBACK_LIKE, 'POST', payload, token);
}

export const getFilters = async (token: string) => {
  return await fetchAPI(FILTERS, token);
}

export const getFeedbackComments = async (id: number, token: string) => {
  return await fetchAPI(`${FEEDBACKS}/${id}/comments`, token);
}

export const searchCategoryAPI = async (token: string, query?: any) => {
  let url = `${SEARCH_CATEGORIES}?key=${query?.q ?? ''}&filters=${query?.filters ?? []}`;
  if (query?.page) {
    url = `${url}?key=${query?.q}&page=${query?.page}`;
  }
  return await fetchAPI(url, token);
}

export const searchVendorsAPI = async (token: string, query?: any) => {
  let url = `${SEARCH_VENDORS}?key=${query?.q}&`;
  if (query?.sort) {
    url += `sort=${query.sort}&direction=${query.direction}&`;
  }
  if (query?.filters) {
    url += `filters=${query.filters}&`;
  }
  if (query?.page) {
    url += `page=${query?.page}`;
  }
  return await fetchAPI(url, token);
}

export const getVendorFeedbacks = async (id: number, token: string) => {
  return await fetchAPI(`${VENDOR_FEEDBACKS}/${id}`, token);
}

export const getCategoryFeedbacks = async (id: number, token: string) => {
  return await fetchAPI(`${CATEGORY_FEEDBACKS}/${id}`, token);
}

export const compareVendorsAPI = async (payload: any, token: string) => {
  return await fetchPostAPI(`${VENDORS}/compare`, 'POST', payload, token);
}
