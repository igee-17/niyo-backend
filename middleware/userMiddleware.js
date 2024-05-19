

exports.getUserEmail = async (userId, pool) => {
    // Fetch user email using ID
    const [userRows] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
        return res.status(401).send({ message: 'Unauthorized: Invalid user ID' });
    }

    const userEmail = userRows[0].email;
    return userEmail
}

