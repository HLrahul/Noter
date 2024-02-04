/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useFileStore } from "@/stores/fileStore";
import { fileType } from "@/types/fileType";
import { useUploadFileMutation } from "@/hooks/fileHooks";
import { set } from "date-fns";
import React from "react";

const formSchema = z.object({
    batch: z.string().refine((value) => /^\d{4}$/.test(value), {
        message: "Batch should be a 4-digit number",
        params: { regex: "/^\\d{4}$/" },
    }),
    department: z.string().min(1, { message: "Please select a department." }),
    year: z.string().min(1, { message: "Year is required" }),
    semester: z.string().min(1, { message: "Semester is required" }),
    subjectcode: z.string().length(6, {
        message: "Subject Code should be exactly 6 letters long",
    }),
    filename: z
        .string()
        .min(5, { message: "File Name should have at least 5 characters" })
        .max(30, { message: "File Name should have at most 30 characters" }),
    file: z
        .any()
        .refine((value) => value !== null, { message: "File is required" }),
});

export default function FileUploadDialog({
    dialogTrigger,
    setDialogTrigger,
}: {
    dialogTrigger: boolean;
    setDialogTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const {
        batch,
        year,
        department,
        semester,
        subjectcode,
        filename,
        file,
        setBatch,
        setYear,
        setDepartment,
        setSemester,
        setSubjectCode,
        setFileName,
        setFile,
        resetFile,
    } = useFileStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            batch,
            year,
            department,
            semester,
            subjectcode,
            filename,
            file,
        },
    });

    const mutation = useUploadFileMutation();

    const handleSave = async (data: z.infer<typeof formSchema>) => {
        const uploadFile: fileType = {
            batch,
            year,
            department,
            semester,
            subjectcode,
            filename,
            file,
        };

        mutation.mutate(uploadFile);
        setDialogTrigger(false);
        resetFile();
        form.reset();
    };

    return (
        <Dialog
            open={dialogTrigger}
            onOpenChange={(open) => {
                setDialogTrigger(open);
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Choose the File and update the details. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)}>
                        <FormField
                            control={form.control}
                            name="batch"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Batch</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="2021"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setBatch(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setDepartment(value);
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                CSE
                                            </SelectItem>
                                            <SelectItem value="2">
                                                IT
                                            </SelectItem>
                                            <SelectItem value="3">
                                                ECE
                                            </SelectItem>
                                            <SelectItem value="4">
                                                EEE
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setYear(value);
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">I</SelectItem>
                                            <SelectItem value="2">
                                                II
                                            </SelectItem>
                                            <SelectItem value="3">
                                                III
                                            </SelectItem>
                                            <SelectItem value="4">
                                                IV
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="semester"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semester</FormLabel>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSemester(value);
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Semester" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {year && (
                                                <>
                                                    <SelectItem
                                                        value={String(
                                                            Number(year) * 2 - 1
                                                        )}
                                                    >
                                                        {Number(year) * 2 - 1}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={String(
                                                            Number(year) * 2
                                                        )}
                                                    >
                                                        {Number(year) * 2}
                                                    </SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subjectcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="CC1234"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setSubjectCode(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="filename"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Unit 1 Imp Ques"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setFileName(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={({
                                field: { onChange, onBlur, name },
                            }) => (
                                <FormItem>
                                    <FormLabel>Upload</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="file"
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xlsx,.csv,.xls,.txt"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    setFile(file);
                                                }
                                                onChange(file);
                                            }}
                                            onBlur={onBlur}
                                            name={name}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-6">
                            Save changes
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}