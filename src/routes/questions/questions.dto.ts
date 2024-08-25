import {
    IsInt,
    IsString,
    Max,
    Min
} from "class-validator";

export class QuestionDTO {

    @IsInt({message: "Must be an int."})
    @Max(6, {message: "Cannot be larger than 6"})
    @Min(1, {message: "Must be at least 1"})
    number_of_questions!: number;

    @IsString()
    file_id!: string;

};