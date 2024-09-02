import { Path } from "glob"
import { AiService } from "./AiService"
import { MockSarapeAi } from "./MockSarapeAi"
import { SarapeAi } from "./SarapeAi"

export class AiFactory {
    static makeAi(
        pdf_dir: string,
        question_dir: string,
        api_key: string
    ): AiService {
        if(process.env.IS_MOCK == "YES")
            return new MockSarapeAi(pdf_dir, question_dir, api_key)
        return new SarapeAi(pdf_dir, question_dir, api_key);
    }
}