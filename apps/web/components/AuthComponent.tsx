import Form from "next/form"
import { Button } from "./Button"
import { Input } from "./Input"

interface IAuthComponent {
    isSignin: boolean,
}

export default function AuthComponent({isSignin}: IAuthComponent) {

    async function SubmitData(data: FormData) {
        "use server"
        console.log(data.get("username"));
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-slate-100">
            <div className="flex flex-col justify-center items-center h-fit w-fit rounded-md shadow bg-white">
                <div className="font-bold text-4xl p-8">
                    {isSignin? "Sign In" : "Sign Up"}
                </div>
                <Form action={SubmitData} className="flex flex-col justify-center items-center m-4">
                {!isSignin && <Input type="email" placeholder="Email" autoComplete="email" name="email"/>}
                <Input type="text" placeholder="Username" autoComplete="username" name="username"/>
                <Input type="password" placeholder="Password" autoComplete="current-password" name="password"/>
                <Button value={isSignin? "SignIn" : "SignUp"}/>
                </Form>
            </div>
        </div>
    )
}