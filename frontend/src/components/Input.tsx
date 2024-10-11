import { SignUpSchema } from "@singhbetu188/medium-blog-common";

type InputProps = {
    label: string
    type: string
    placeholder: string
    handler: Function
    value: string
}

export default function Input({ label, type, placeholder, handler, value }: InputProps) {
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        handler((prev: SignUpSchema) => {
            return { ...prev, [label]: e.target.value };
        });
    }

    return (
        <div className="w-full">
            <label htmlFor={label} className="font-semibold text-lg capitalize">{label}</label>
            <input
                type={type}
                id={label}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value}
                required
                className="w-full p-2 rounded-lg outline-none border-2 border-gray-400 focus:border-gray-700 block"
            />
        </div>
    );
}