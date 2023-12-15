using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedCascadeDeleteOnConversation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Shipments_ShipmentId",
                table: "Conversations");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Shipments_ShipmentId",
                table: "Conversations",
                column: "ShipmentId",
                principalTable: "Shipments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Shipments_ShipmentId",
                table: "Conversations");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Shipments_ShipmentId",
                table: "Conversations",
                column: "ShipmentId",
                principalTable: "Shipments",
                principalColumn: "Id");
        }
    }
}
