interface IInput {
    className?: string,
    placeholder: string,
    type: "text" | "password" | "email",
    name?: string,
    autoComplete: "email" | "current-password" | "username"
}

export function Input({className, placeholder, type, name, autoComplete}: IInput) {
    return (
        <input required type={type} placeholder={placeholder} className={ className || "rounded p-2 m-2 w-full max-w-[350px] border border-slate-300"} autoComplete={autoComplete} name={name}/>
    )
}