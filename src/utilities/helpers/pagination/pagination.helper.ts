import { Pagination } from "./pagination.validation";

const paginationHelper = async (pagination: Pagination) => {
  const {
    Model,
    query,
    defaultQuery = {},
    filterableFields = [],
    customFilters = {},
    defaultPage = 1,
    defaultLimit = 20,
    searchableFields,
    sortOptions = { createdAt: -1 },
    select,
    populate,
    lean = false,
  } = pagination;
  const allQuery = { ...defaultQuery, ...query };
  const { page, limit, search, all } = query;

  // FILTER
  const defaultFilterableFields = ["isActive"];
  const allFilterableFields = [...defaultFilterableFields, ...filterableFields];
  let filter: any = {};

  const queryKeys = Object.keys(allQuery);
  allFilterableFields.map((f) => {
    if (queryKeys.includes(f)) {
      if ("true" === allQuery[f]) {
        filter[f] = true;
      } else if ("false" === allQuery[f]) {
        filter[f] = false;
      } else filter[f] = allQuery[f];
    }
  });

  if (search && Array.isArray(searchableFields) && searchableFields.length) {
    const regex = new RegExp(`${search.toLowerCase()}`, "i");
    const searchableFieldQueries = searchableFields.map((field: any) => {
      if (typeof field === "function") return field(regex);
      return { [field]: { $regex: regex } };
    });
    filter = Object.assign(filter, { $or: searchableFieldQueries });
  }

  filter = { ...filter, ...customFilters };

  const options = {
    page: page || defaultPage,
    limit: limit || defaultLimit,
    sort: sortOptions,
    select,
    populate,
    lean,
    leanWithId: false,
  };

  if (all) {
    delete filter.isActive;
  }

  try {
    const result = await Model.paginate(filter, options);
    // result.docs
    // result.totalDocs = 100
    // result.limit = 10
    // result.page = 1
    // result.totalPages = 10
    // result.hasNextPage = true
    // result.nextPage = 2
    // result.hasPrevPage = false
    // result.prevPage = null
    // result.pagingCounter = 1
    return result;
  } catch (error) {
    console.log(`error`, error);
  }
};

export default paginationHelper;
