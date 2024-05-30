export class FollowDto {
  constructor(id: number, targetId: number) {
    this.id = id;
    this.targetId = targetId;
  }
  id: number;
  targetId: number;
}
