const AppError = require("../errors/AppError");

function parsePagination(query) {
  const errors = [];

  let page = 1;
  if (query.page !== undefined) {
    const n = Number(query.page);
    if (!Number.isInteger(n) || n < 1) {
      errors.push({
        field: "page",
        message: "page must be a positive integer",
      });
    } else {
      page = n;
    }
  }

  let limit = 10;
  if (query.limit !== undefined) {
    const n = Number(query.limit);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      errors.push({
        field: "limit",
        message: "limit must be an integer between 1 and 100",
      });
    } else {
      limit = n;
    }
  }

  let archived;
  if (query.archived !== undefined) {
    if (query.archived === "true") archived = true;
    else if (query.archived === "false") archived = false;
    else
      errors.push({
        field: "archived",
        message: 'archived must be "true" or "false"',
      });
  }

  let search;
  if (query.search !== undefined) {
    if (typeof query.search !== "string" || query.search.trim() === "") {
      errors.push({
        field: "search",
        message: "search must be a non-empty string",
      });
    } else {
      search = query.search.trim();
    }
  }

  if (errors.length) {
    throw new AppError(
      "Invalid query parameters",
      400,
      "ValidationError",
      errors,
    );
  }

  return { page, limit, archived, search };
}

function validateCreate(body) {
  const errors = [];
  const data = {};

  if (typeof body?.title !== "string" || body.title.trim() === "") {
    errors.push({
      field: "title",
      message: "title is required and must be a non-empty string",
    });
  } else {
    data.title = body.title.trim();
  }

  if (typeof body?.content !== "string" || body.content.trim() === "") {
    errors.push({
      field: "content",
      message: "content is required and must be a non-empty string",
    });
  } else {
    data.content = body.content.trim();
  }

  if (body?.archived !== undefined) {
    if (typeof body.archived !== "boolean") {
      errors.push({ field: "archived", message: "archived must be a boolean" });
    } else {
      data.archived = body.archived;
    }
  }

  if (errors.length) {
    throw new AppError("Validation failed", 400, "ValidationError", errors);
  }

  return data;
}

function validateUpdate(body) {
  const errors = [];
  const data = {};

  if (body?.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      errors.push({
        field: "title",
        message: "title must be a non-empty string",
      });
    } else {
      data.title = body.title.trim();
    }
  }

  if (body?.content !== undefined) {
    if (typeof body.content !== "string" || body.content.trim() === "") {
      errors.push({
        field: "content",
        message: "content must be a non-empty string",
      });
    } else {
      data.content = body.content.trim();
    }
  }

  if (body?.archived !== undefined) {
    if (typeof body.archived !== "boolean") {
      errors.push({ field: "archived", message: "archived must be a boolean" });
    } else {
      data.archived = body.archived;
    }
  }

  if (errors.length) {
    throw new AppError("Validation failed", 400, "ValidationError", errors);
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided", 400, "ValidationError", [
      { field: "body", message: "at least one field must be provided" },
    ]);
  }

  return data;
}

module.exports = { parsePagination, validateCreate, validateUpdate };
