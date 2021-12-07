const Patterns = {
    name: /^[A-Z a-z]+$/,
    email: /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    password: /^(?=.*[\d])(?=.*[a-zA-Z])[\w!@#$%^&*]{6,16}$/
}

module.exports = Patterns;