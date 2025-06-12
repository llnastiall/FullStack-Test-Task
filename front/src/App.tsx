import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "@/pages/Login.tsx";
import Register from "@/pages/Register.tsx";
import Projects from "@/pages/Projects.tsx";
import {ProtectedRoute} from "@/ProtectedRoute.tsx";
import {Toaster} from "sonner";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <Projects/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
            <Toaster/>
        </>
    )
}

export default App