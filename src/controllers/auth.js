export const register = async (req, res, next) => {
  try {
    res.send(req.body);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
