import bcrypt from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
    const saltRounds = 15;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}