export class UpdateTagDto {
  constructor(id: number, contents: string) {
    this.id = id;
    this.contents = contents;
  }
  id: number;
  contents: string;
}
