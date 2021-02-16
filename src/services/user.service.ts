import { NextFunction, Request, Response } from 'express';
import validator from 'validator';
import HttpException from '../app/common/HttpException';
import { IEditUser } from '../app/common/interfaces/IEditUser.model';
import { ISignUp } from '../app/common/interfaces/ISignUp.model';
import UserRepository from "../repositories/user.repository";

class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async signUp(req: Request, res: Response, next: NextFunction) {
        const body = req.body as ISignUp;

        if (!body || Object.getOwnPropertyNames(body).length === 0) {
            return next(new HttpException(404, 'No data provided.'));
        }

        if(!body.name || !body.userName || !validator.isEmail(body.email)) {
            return next(new HttpException(412, 'Precondition Failed.'));
        }

        const user = await this.userRepository.signUpUser(body);
        if (!user) {
            next(new HttpException());
        }

        return res.status(200).send(user);
    }

    public async getUserById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            next(new HttpException(404, 'No data provided.'));
        }

        const user = await this.userRepository.getUserById(req.params.id);
        if (!user) {
            next(new HttpException(400, 'User not found.'));
        }

        return res.status(200).send(user);
    }

    public async editUserById(req: Request, res: Response, next: NextFunction) {
        const body = req.body as IEditUser;

        if (!body || !req.params.id || Object.getOwnPropertyNames(body).length === 0) {
            next(new HttpException(404, 'No data provided.'));
        }

        if(body.email && !validator.isEmail(body.email)){
            return next(new HttpException(412, 'Precondition Failed.'));
        }

        const user = await this.userRepository.editUserById(req.params.id, body);
        if (!user) {
            next(new HttpException(400, 'Cannot update user.'));
        }

        return res.status(200).send(user);
    }

}

export default UserService;