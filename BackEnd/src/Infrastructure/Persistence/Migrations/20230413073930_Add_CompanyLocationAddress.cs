using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_CompanyLocationAddress : Migration
    {
        /// <inheritdoc />
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0053:Use expression body for lambda expression", Justification = "<Pending>")]
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InLandAddressId",
                table: "CompanyLocation",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MailingAddressId",
                table: "CompanyLocation",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Fax",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "LastName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "CompanyLocationAddress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Apartment = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyLocationAddress", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocation_InLandAddressId",
                table: "CompanyLocation",
                column: "InLandAddressId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocation_MailingAddressId",
                table: "CompanyLocation",
                column: "MailingAddressId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_InLandAddressId",
                table: "CompanyLocation",
                column: "InLandAddressId",
                principalTable: "CompanyLocationAddress",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_MailingAddressId",
                table: "CompanyLocation",
                column: "MailingAddressId",
                principalTable: "CompanyLocationAddress",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_InLandAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_MailingAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropTable(
                name: "CompanyLocationAddress");

            migrationBuilder.DropIndex(
                name: "IX_CompanyLocation_InLandAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropIndex(
                name: "IX_CompanyLocation_MailingAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropColumn(
                name: "InLandAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropColumn(
                name: "MailingAddressId",
                table: "CompanyLocation");

            migrationBuilder.AlterColumn<string>(
                name: "Fax",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "LastName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "");
        }
    }
}
