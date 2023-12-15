using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedEntitesForReminder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReminderStatus",
                table: "Shipments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_ClientFirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReminderEmail_DateToRemind",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_Email",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_ForwarderName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_LatestUpdate",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_Locale",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_ShipmentId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReminderEmail_Subject",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReminderStatus",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_ClientFirstName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_DateToRemind",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_Email",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_ForwarderName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_LatestUpdate",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_Locale",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_ShipmentId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReminderEmail_Subject",
                table: "AspNetUsers");
        }
    }
}
