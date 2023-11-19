using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleServerMonitoring.ServerApp.Migrations
{
    /// <inheritdoc />
    public partial class AddedDescriptionProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Instances",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Instances");
        }
    }
}
