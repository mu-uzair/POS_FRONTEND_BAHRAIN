// import { useEffect } from "react";
// import { getUserData } from "../https";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setUser, removeUser } from "../redux/slice/userSlice";



// const useLoadData = () => {

//     useEffect(() => {

//         const fetchUser = async () => {

//             const dispatch = useDispatch();
//             const navigate = useNavigate();

//             try {

//                 const { data } = await getUserData();
//                 console.log(data);
//                 const { _id, name, email, phone, role } = data.data;
//                 dispatch(setUser({ _id, name, email, phone, role }));

//             } catch (error) {
//                 dispatch(removeUser());
//                 navigate("/auth");
//                 console.log(error);

//             }
//         }
//         fetchUser();

//     }, [dispatch,navigate]);

// }

// export default useLoadData;

import { useEffect, useState } from "react";
import { getUserData } from "../https";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, removeUser } from "../redux/slice/userSlice"; // Import setUser and removeUser

const useLoadData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await getUserData();
                console.log(data);
                const { _id, name, email, phone, role } = data.data;
                dispatch(setUser({ _id, name, email, phone, role }));
            } catch (error) {
                dispatch(removeUser());
                navigate("/auth");
                console.log(error);
            }
            finally{
                setIsloading(false);
            }
        };
        fetchUser();
    }, [dispatch, navigate]); // Correct dependency array
return isLoading;
};

export default useLoadData;