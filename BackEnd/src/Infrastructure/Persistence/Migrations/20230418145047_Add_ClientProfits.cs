using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations;

/// <inheritdoc />
public partial class Add_ClientProfits : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "ClientProfitsId",
            table: "AspNetUsers",
            type: "int",
            nullable: true);

        migrationBuilder.CreateTable(
            name: "ClientProfits",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                LCL = table.Column<double>(type: "float", nullable: false),
                FCL = table.Column<double>(type: "float", nullable: false),
                Air = table.Column<double>(type: "float", nullable: false),
                CustomClearance = table.Column<double>(type: "float", nullable: false),
                OriginCharges = table.Column<double>(type: "float", nullable: false),
                DestinationCharges = table.Column<double>(type: "float", nullable: false),
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ClientProfits", x => x.Id);
                table.ForeignKey(
                    name: "FK_ClientProfits_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_ClientProfits_UserId",
            table: "ClientProfits",
            column: "UserId",
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "ClientProfits");

        migrationBuilder.DropColumn(
            name: "ClientProfitsId",
            table: "AspNetUsers");
    }
}
