using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_IndustryType : Migration
    {
        /// <inheritdoc />
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0053:Use expression body for lambda expression", Justification = "<Pending>")]
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IndustryTypeId",
                table: "Companies",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "IndustryTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndustryTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Companies_IndustryTypeId",
                table: "Companies",
                column: "IndustryTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_IndustryTypes_IndustryTypeId",
                table: "Companies",
                column: "IndustryTypeId",
                principalTable: "IndustryTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_IndustryTypes_IndustryTypeId",
                table: "Companies");

            migrationBuilder.DropTable(
                name: "IndustryTypes");

            migrationBuilder.DropIndex(
                name: "IX_Companies_IndustryTypeId",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "IndustryTypeId",
                table: "Companies");
        }
    }
}
