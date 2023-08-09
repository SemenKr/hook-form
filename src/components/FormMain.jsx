import {useFieldArray, useForm} from "react-hook-form";
import {DevTool} from "@hookform/devtools";
import {useState} from "react";


export const FormMain = () => {

    const [formData, setFormData] = useState(null); // Состояние для хранения данных формы


    const {
        register,
        control,
        handleSubmit,
        formState,
    } = useForm({
        defaultValues: async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/users/3');
            const data = await response.json()
            return {
                username: data.username,
                email: data.email,
                age: 0,
                agree: false,
                social: {
                    twitter: '',
                    facebook: '',
                },
                phoneNumbers: ['', ''],
                phNumbers: [{number: ''}],
            }
        }
    })

    const {
        errors,
    } = formState;

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        name: 'phNumbers',
        control
    })

    const onSubmit = data => {
        console.log('Форма отправлена', data);
        setFormData(data); // Обновление состояния с данными формы
    }


    return (
        <>
            <h1>Main Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                <div className="">
                    <label htmlFor="username">Name</label>
                    <input type="text" id='username' name='username' {...register('username', {
                        required: 'Username is required'
                    })}/>
                    <p className='error'>{errors.username?.message}</p>
                </div>

                <div className="">
                    <label htmlFor="email">Email</label>
                    <input type="email" id={'email'} name={'email'} {...register('email', {
                        pattern: {
                            value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                            message: 'Введите правильный формат электронной почты',
                        },
                        validate: {
                            notAdmin: (fieldValue) => {
                                return (
                                    fieldValue !== 'www@www.com' | 'Введите другой адресс'
                                )
                            },
                            notBlackListed: (fieldValue) => {
                                return (!fieldValue.endsWith('mania.com') ||
                                    'Домен не поддерживается'
                                )
                            },
                        }
                    })}/>
                    <p className='error'>{errors.email?.message}</p>
                </div>

                <div className="">
                    <label htmlFor="twitter">twitter</label>
                    <input type="text" id='twitter' name='twitter' {...register('social.twitter')}/>

                </div>

                <div className="">
                    <label htmlFor="facebook">facebook</label>
                    <input type="text" id='facebook' name='facebook' {...register('social.facebook')}/>
                </div>

                <div className="">
                    <label htmlFor="primary-phone">Primary phone number</label>
                    <input type="phone" id='primary-phone' name='primary-phone' {...register('phoneNumbers.0')}/>
                </div>

                <div className="">
                    <label htmlFor="secondary-phone">Secondary phone number</label>
                    <input type="phone" id='secondary-phone' name='secondary-phone' {...register('phoneNumbers.1')}/>
                </div>

                <div className="">
                    <label htmlFor="age">Age</label>
                    <input type="number" id={'age'} name={'age'} {...register('age')}/>
                    <p className='error'>{errors.age?.message}</p>
                </div>

                <div className="">
                    <label htmlFor="agree">Agree</label>
                    <input type="checkbox" id={'agree'} name={'agree'} {...register('agree', {
                        required: 'Обязательное поле'
                    })}/>
                    {errors && <p className='error'>{errors.agree?.message}</p>}
                </div>
                {formData && (
                    <div>
                        <h2>Введенные данные:</h2>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
                    </div>
                )}

                <div>
                    <label htmlFor="">Список телефонных номеров</label>
                    <div>
                        {
                            fields.map((field, index) => {
                                return (
                                    <div className='form-control' key={field.id}>
                                        <input type="text" {...register(`phNumbers.${index}.number`)} />
                                        {
                                            index > 0 && (
                                                <button type={"button"} onClick={() => {remove({ number: ''})}}>убрать номер тулуфона</button>

                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                        <button type={"button"} onClick={() => {append({ number: ''})}}>Добавить номер тулуфона</button>
                    </div>
                </div>

                <button>Отправить</button>

            </form>
            <DevTool control={control}/> {/* set up the dev tool */}
        </>
    )
}
