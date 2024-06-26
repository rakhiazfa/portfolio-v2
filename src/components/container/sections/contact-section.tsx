'use client';

import { InputField } from '@/components/ui/input-field';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { motion } from 'framer-motion';
import { TextareaField } from '@/components/ui/textarea-field';
import { useForm } from 'react-hook-form';
import { ref, set } from 'firebase/database';
import { database } from '@/services/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import Title from '@/components/ui/title';

type SendMessagePayload = {
    name: string;
    email: string;
    message: string;
};

const ContactSection = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SendMessagePayload>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onSubmit = async (payload: SendMessagePayload) => {
        setLoading(true);
        try {
            await set(ref(database, 'messages/' + uuidv4()), {
                ...payload
            });
        } catch (error) {
            console.log(error);
        } finally {
            reset();
            setLoading(false);

            setOpen(true);
            setTimeout(() => setOpen(false), 12500);
        }
    };

    return (
        <>
            <section id="contact" className="w-full py-[5rem]">
                <div className="app-container">
                    <Title className="mb-10">Contact Me</Title>
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-7">
                                <div className="flex flex-col md:flex-row items-center gap-5">
                                    <InputField
                                        label="Name"
                                        placeholder="Full Name"
                                        {...register('name', {
                                            required: 'This name field is required.'
                                        })}
                                        error={errors.name?.message}
                                    />
                                    <InputField
                                        label="Email"
                                        placeholder="Email Address"
                                        {...register('email', {
                                            required: 'This email field is required.',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address.'
                                            }
                                        })}
                                        error={errors.email?.message}
                                    />
                                </div>
                                <TextareaField
                                    label="Message"
                                    placeholder="Write here your message"
                                    {...register('message', {
                                        required: 'This message field is required.'
                                    })}
                                    error={errors.message?.message}
                                />
                                <div className="flex justify-end">
                                    <HoverBorderGradient
                                        containerClassName="rounded-full"
                                        as="button"
                                        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                                        loading={loading}
                                    >
                                        <span>Send Message</span>
                                    </HoverBorderGradient>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>
            <Toast.Provider swipeDirection="right">
                <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
                    <Toast.Description asChild>
                        <p className="text-dark mt-[0.125rem]">Successfully sent the message.</p>
                    </Toast.Description>
                    <Toast.Action className="ToastAction" asChild altText="Goto close toast">
                        <button className="Button small green">Close</button>
                    </Toast.Action>
                </Toast.Root>
                <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
        </>
    );
};

export default ContactSection;
