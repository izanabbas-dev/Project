const checkRole = (...roles) => {
    return async (request, response, next) => {
        if (!request.user) {
            return response.status(401).json({ message: "Authentication required" });
        }

        if (!roles.includes(request.user.role)) {
            return response.status(403).json({ message: "Forbidden: Insufficient role permissions" });
        }

        next();
    };
};

export default checkRole;
