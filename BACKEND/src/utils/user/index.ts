import { NotFoundException } from "@nestjs/common";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";

export const checkUserEsist = async (userRepo: Repository<User>, id: number) => {
    const user = await userRepo.findOne({
        where: { id: id }
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return;
}
