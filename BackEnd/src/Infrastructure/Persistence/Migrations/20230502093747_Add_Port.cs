using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_Port : Migration
    {
        /// <inheritdoc />
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0053:Use expression body for lambda expression", Justification = "<Pending>")]
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DestinationPortId",
                table: "CompanyLocations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Ports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PortType = table.Column<int>(type: "int", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ports", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocations_DestinationPortId",
                table: "CompanyLocations",
                column: "DestinationPortId");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocations_Ports_DestinationPortId",
                table: "CompanyLocations",
                column: "DestinationPortId",
                principalTable: "Ports",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocations_Ports_DestinationPortId",
                table: "CompanyLocations");

            migrationBuilder.DropTable(
                name: "Ports");

            migrationBuilder.DropIndex(
                name: "IX_CompanyLocations_DestinationPortId",
                table: "CompanyLocations");

            migrationBuilder.DropColumn(
                name: "DestinationPortId",
                table: "CompanyLocations");
        }
    }
}
