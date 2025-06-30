import { createContext, useEffect, useReducer } from "react";
import { UserContextType } from "../../types";

import { useNavigate } from "react-router";
import { ChildrenElementProp } from "../../types";
import { User } from "../../types";
import { UserContextReducerActions } from "../../types";

const reducer = (state: Omit<User, 'password'> | null, action: UserContextReducerActions): Omit<User, 'password'> | null => {
    switch (action.type) {
        case 'setUser':
            return action.user;
        case 'logUserOut':
            return null;
        case 'editUser':
            return state ? {
                ...state,
                ...action.user
            } : state;
    }
};

const UsersContext = createContext<UserContextType | undefined>(undefined);

const UsersProvider = ({ children }: ChildrenElementProp) => {
    const [loggedInUser, dispatch] = useReducer(reducer, null);
    const navigate = useNavigate();

    const login = async (loginInfo: Pick<User, 'username' | 'password'>, keepLoggedIn: boolean) => {
        try {
            const Back_Response = await fetch(`http://localhost:5500/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginInfo)
            });

            const data = await Back_Response.json();

            if ('error' in data) {
                return { error: data.error };
            }

            const jwt = data.accessJWT;
                if (!jwt) return { error: "Token missing in response." };

                if (keepLoggedIn) {
                     localStorage.setItem('accessJWT', jwt);
                } else {
                    sessionStorage.setItem('accessJWT', jwt);
            }

            dispatch({
                type: "setUser",
                user: data.userData
            });

            return { success: data.success };
        } catch {
            return { error: 'Login failed, please try again' };
        }
    };

    const logOut = () => {
        localStorage.removeItem('accessJWT');
        sessionStorage.removeItem('accessJWT');
        dispatch({ type: 'logUserOut' });
    };

    const register = async (registerInfo: Omit<User, '_id'>) => {
        try {
            const response = await fetch(`http://localhost:5500/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerInfo)
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    return { error: errorData.error || "Registration failed." };
                } else {
                    const errorText = await response.text(); // Likely HTML
                    console.error("Non-JSON error response from backend:", errorText);
                    return { error: "Unexpected error occurred during registration." };
                }
            }

            const data = await response.json();

            const authHeader = response.headers.get("Authorization");
            if (authHeader !== null) {
                sessionStorage.setItem("accessJWT", authHeader);
            }

            dispatch({
                type: "setUser",
                user: data.userData
            });

            return { success: data.success };
        } catch (err) {
            console.error("Register failed:", err);
            return { error: "Registration failed due to a network or server error." };
        }
    };

    const editUserInfo = async (editedUser: User) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/api/users/editInfo`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessJWT}`
            },
            body: JSON.stringify(editedUser)
        });

        const data = await backResponse.json();

        if ('error' in data) {
            return { error: data.error };
        }

        dispatch({
            type: "setUser",
            user: data.user
        });

        return { success: data.success };
    };

    useEffect(() => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        if (accessJWT) {
            fetch(`http://localhost:5500/api/users/loginAuto`, {
                headers: {
                    Authorization: `Bearer ${accessJWT}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if ('error' in data) {
                        localStorage.removeItem('accessJWT');
                        setTimeout(() => navigate('/login'), 3000);
                    } else {
                        dispatch({
                            type: "setUser",
                            user: data
                        });
                    }
                });
        }
    }, [navigate]);

    return (
        <UsersContext.Provider
            value={{
                loggedInUser,
                login,
                logOut,
                register,
                editUserInfo
            }}
        >
            {children}
        </UsersContext.Provider>
    );
};

export { UsersProvider };
export default UsersContext;