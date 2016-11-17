"use strict";

/* eslint-env jest */
jest.mock("redis");
import app from "../index.js";
import supertest from "supertest";
import * as user from "../user.js";
import * as jwt from "jsonwebtoken";
import moment from "moment";

const request = supertest.agent(app.listen());

async function register(username) {
    try {
        await user.register(username, "123456");
    } catch (ex) {
        // empty
    }
}
async function cancel(username) {
    try {
        const userId = await user.getUserIdByUsername(username);
        await user.cancel(userId);
    } catch (ex) {
        // empty
    }
}

describe("test register user api", () => {
    it("username, password are missing", done => {
        request.post("/api/users")
            .set("Content-Type", "application/json")
            .send({})
            .expect(400, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        valueMissing: true,
                    },
                    password: {
                        valid: false,
                        valueMissing: true,
                    },
                    email: {
                        valid: true,
                    },
                },
            })
            .end((err, res) => {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });
    it("username is too short when username length less then 2", done => {
        request.post("/api/users")
            .set("Content-Type", "application/json")
            .send({ username: "t" })
            .expect(400, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        tooShort: true,
                    },
                    password: {
                        valid: false,
                        valueMissing: true,
                    },
                    email: {
                        valid: true,
                    },
                },
            })
            .end((err, res) => {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });
    it("username is too loog when username length greater than 32", done => {
        request.post("/api/users")
            .set("Content-Type", "application/json")
            .send({ username: "t".repeat(33) })
            .expect(400, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        tooLong: true,
                    },
                    password: {
                        valid: false,
                        valueMissing: true,
                    },
                    email: {
                        valid: true,
                    },
                },
            })
            .end((err, res) => {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });
    it("password is too short when password length less than 6", done => {
        request.post("/api/users")
            .set("Content-Type", "application/json")
            .send({ password: "p".repeat(5) })
            .expect(400, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        valueMissing: true,
                    },
                    password: {
                        valid: false,
                        tooShort: true,
                    },
                    email: {
                        valid: true,
                    },
                },
            })
            .end((err, res) => {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });
    it("password is too loog when password length greater than 128", done => {
        request.post("/api/users")
            .set("Content-Type", "application/json")
            .send({ password: "p".repeat(129) })
            .expect(400, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        valueMissing: true,
                    },
                    password: {
                        valid: false,
                        tooLong: true,
                    },
                    email: {
                        valid: true,
                    },
                },
            })
            .end((err, res) => {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });
    it("email is not valid", done => {
        request.post("/api/users")
            .set("Content-Type", "application/json")
            .send({ email: "p" })
            .expect(400, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        valueMissing: true,
                    },
                    password: {
                        valid: false,
                        valueMissing: true,
                    },
                    email: {
                        valid: false,
                        typeMismatch: true,
                    },
                },
            })
            .end((err, res) => {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });
    describe("test register success", () => {
        beforeAll(cancel.bind(null, "admin"));
        afterAll(cancel.bind(null, "admin"));
        it("should response 201 Created", done => {
            request.post("/api/users")
                .set("Content-Type", "application/json")
                .send({ username: "admin", password: "123456" })
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        done();
                    }
                });
        });
    });
    describe("test register fail", () => {
        beforeAll(register.bind(null, "admin"));
        afterAll(cancel.bind(null, "admin"));
        it("should response 400 that the username is exists", done => {
            request.post("/api/users")
                .set("Content-Type", "application/json")
                .send({ username: "admin", password: "123456" })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        done();
                    }
                });
        });
    });
});

describe("test login api", () => {
    describe("success", () => {
        beforeAll(register.bind(null, "admin"));
        afterAll(cancel.bind(null, "admin"));
        it("should response 200 when login success", done => {
            request.post("/api/authentication")
                .set("Content-Type", "application/json")
                .send({ username: "admin", "password": "123456" })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.error(res.body);
                        done.fail(err);
                        return;
                    }
                    const token = res.body.token;
                    const decoded = jwt.decode(token);
                    try {
                        expect(decoded.aud).toBe("admin");
                        done();
                    } catch (ex) {
                        done.fail(ex);
                    }
                });
        });
        it("should remember user login state", done => {
            const expire = moment().add(1, "months").unix();
            request.post("/api/authentication")
                .set("Content-Type", "application/json")
                .send({ username: "admin", "password": "123456", rememberMe: true })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.error(res.body);
                        done.fail(err);
                        return;
                    }
                    const token = res.body.token;
                    const decoded = jwt.decode(token);
                    try {
                        expect(decoded.aud).toBe("admin");
                        expect(decoded.exp).toBeGreaterThanOrEqual(expire);
                        done();
                    } catch (ex) {
                        done.fail(ex);
                    }
                });
        });
    });
    describe("fail", () => {
        beforeAll(register.bind(null, "admin"));
        afterAll(cancel.bind(null, "admin"));
        it("should response 400 when password incorrect", done => {
            request.post("/api/authentication")
                .set("Content-Type", "application/json")
                .send({ username: "admin", "password": "12345689" })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        console.error(res.body);
                        done.fail(err);
                    } else {
                        done();
                    }
                });
        });
        it("should response 400 when username is not exists", done => {
            request.post("/api/authentication")
                .set("Content-Type", "application/json")
                .send({ username: "guest", "password": "123456" })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        console.error(res.body);
                        done.fail(err);
                    } else {
                        done();
                    }
                });
        });
    });
});

describe("test logout api", () => {
    beforeAll(register.bind(null, "admin"));
    afterAll(cancel.bind(null, "admin"));
    it("should response 200 when the user logout success", done => {
        request.post("/api/authentication")
            .set("Content-Type", "application/json")
            .send({ username: "admin", password: "123456" })
            .end((err, res) => {
                if (err) {
                    console.error(res.body);
                    done.fail(err);
                    return;
                }
                const token = res.body.token;
                request.delete("/api/authentication")
                    .set("Authorization", `bearer ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            console.error(res.body);
                            done.fail(err);
                        } else {
                            done();
                        }
                    });
            });
    });
    it("should response 400 when the user logouted", done => {
        request.post("/api/authentication")
            .set("Content-Type", "application/json")
            .send({ username: "admin", password: "123456" })
            .end((err, res) => {
                if (err) {
                    console.error(res.body);
                    done.fail(err);
                    return;
                }
                const token = res.body.token;
                request.delete("/api/authentication")
                    .set("Authorization", `bearer ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            console.error(res.body);
                            done.fail(err);
                        } else {
                            request.delete("/api/authentication")
                                .set("Authorization", `bearer ${token}`)
                                .expect(401)
                                .end((err, res) => {
                                    if (err) {
                                        console.error(res.body);
                                        done.fail(err);
                                    } else {
                                        done();
                                    }
                                });
                        }
                    });
            });
    });
});

describe("test get user information api", () => {
    beforeAll(register.bind(null, "admin"));
    afterAll(cancel.bind(null, "admin"));
    it("");
});

describe("test post message api", () => {
    it("");
});

describe("test get message api", () => {
    it("");
});
