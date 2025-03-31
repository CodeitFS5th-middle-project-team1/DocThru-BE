import z from 'zod';

// TODO: 테스트용입니다. 나중에 삭제 예정입니다.
export const testParamsSchema = z.object({
  id: z.string().uuid({ message: 'id는 uuid 형식어아야 합니다.' }),
});

export const testQueriesSchema = z.object({
  sort: z.enum(['desc', 'asc'], {
    message: 'sort는 desc, asc 중 하나',
  }),
});

export const testBodySchema = z.object({
  email: z.string().email({ message: '이메일 형식을 지켜주세요.' }),
  password: z.string().min(8, { message: '비번 8자리 이상' }),
});

export type testRequestParams = z.infer<typeof testParamsSchema>;
export type testRequestQueries = z.infer<typeof testQueriesSchema>;
export type testRequestBody = z.infer<typeof testBodySchema>;

// 회원가입 API
export const SignUpBodySchema = z.object({
  email: z.string().email({ message: '이메일 형식을 지켜주세요.' }),
  nickName: z.string(),
  password: z.string().min(8, { message: '비밀번호는 8자리 이상' }),
});

export type SignUpBodyDTO = z.infer<typeof SignUpBodySchema>;

// export interface SighUpResponseDTO {
//     user: {
//         email: string,
//         nickName: string
//     }
// }

// 로그인 API
export const LoginBodySchema = z.object({
  email: z.string().email({ message: '이메일 형식을 지켜주세요.' }),
  password: z.string().min(8, { message: '비밀번호는 8자리 이상' }),
});

export type LoginBodyDTO = z.infer<typeof LoginBodySchema>;
