import jwt from 'jsonwebtoken'

export const generateToken = async (payload, res)=>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie("jwt", token, {
		maxAge: 7 * 24 * 60 * 1000, // 7 days in MS
		httpOnly: true, // prevent xss attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgary attacks
		secure: process.env.NODE_ENV !== "development", // http for development and https for production
	});

    return token;
}