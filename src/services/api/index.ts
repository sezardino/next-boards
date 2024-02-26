import { AuthApiModule } from "./modules/auth";
import { BoardApiModule } from "./modules/board";
import { ColumnApiModule } from "./modules/column";
import { ProfileApiModule } from "./modules/profile";
import { TaskApiModule } from "./modules/task";
import { UserApiModule } from "./modules/user";

class ApiService {
  auth: AuthApiModule;
  board: BoardApiModule;
  profile: ProfileApiModule;
  user: UserApiModule;
  column: ColumnApiModule;
  task: TaskApiModule;

  constructor(private readonly baseUrl: string) {
    this.auth = new AuthApiModule(baseUrl);
    this.board = new BoardApiModule(baseUrl);
    this.profile = new ProfileApiModule(baseUrl);
    this.user = new UserApiModule(baseUrl);
    this.column = new ColumnApiModule(baseUrl);
    this.task = new TaskApiModule(baseUrl);
  }
}

export const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL!);
