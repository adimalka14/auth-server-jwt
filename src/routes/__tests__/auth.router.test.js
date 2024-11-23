const request = require('supertest');
const { StatusCodes } = require('http-status-codes'); // שימוש בספרייה לניהול קודי סטטוס
const app = require('../../app');
const User = require('../../models/users.model');
const { generateRefreshToken, generateAccessToken } = require('../../utils/token');

describe('Authentication Endpoints', () => {
    let testRunId;
    let testUser;

    beforeEach(async () => {
        const uniqueUsername = `testuser-${Date.now()}`;
        testUser = await User.create({
            username: uniqueUsername,
            password: 'password123',
        });

        accessToken = generateAccessToken(testUser._id);
    });

    afterEach(async () => {
        await User.deleteOne({ username: testUser.username });
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ username: `newuser-${testRunId}`, password: 'password123', testRunId });

            expect(res.statusCode).toBe(StatusCodes.CREATED);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should fail when username already exists', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ username: testUser.username, password: 'password123' });

            expect(res.statusCode).toBe(StatusCodes.CONFLICT);
            expect(res.body).toHaveProperty('message', 'Username already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app).post('/auth/login').send({
                username: testUser.username,
                password: 'password123',
            });

            expect(res.statusCode).toBe(StatusCodes.OK);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should fail with incorrect credentials', async () => {
            const res = await request(app).post('/auth/login').send({
                username: testUser.username,
                password: 'wrongpassword',
            });

            expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Invalid username or password');
        });

        it('should fail when username is missing', async () => {
            const res = await request(app).post('/auth/login').send({ password: 'password123' });

            expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty('message', 'Username and password are required');
        });
    });

    describe('GET /auth/logout', () => {
        it('should logout successfully', async () => {
            const res = await request(app).get('/auth/logout').set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(StatusCodes.OK);
            expect(res.body).toHaveProperty('message', 'Logout successful');

            // בדיקה שה-Refresh Token נמחק
            const user = await User.findById(testUser._id);
            expect(user.refreshToken).toBeUndefined();
        });

        it('should fail logout without authentication', async () => {
            const res = await request(app).get('/auth/logout');
            expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });
    });

    describe('GET /auth/refresh', () => {
        let refreshToken;

        beforeEach(async () => {
            refreshToken = generateRefreshToken(testUser._id);
            await testUser.save();
        });

        it('should refresh access token successfully', async () => {
            const res = await request(app).get('/auth/refresh').set('Cookie', `refreshToken=Bearer ${refreshToken}`);

            expect(res.statusCode).toBe(StatusCodes.OK);
            expect(res.body).toHaveProperty('accessToken');
        });

        it('should fail with invalid refresh token', async () => {
            const res = await request(app).get('/auth/refresh').set('Cookie', 'refreshToken=Bearer invalidtoken');

            expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(res.body).toHaveProperty('message', 'Invalid refresh token');
        });

        it('should fail when refresh token is missing', async () => {
            const res = await request(app).get('/auth/refresh');

            expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty('message', 'missing refresh token');
        });
    });
});
