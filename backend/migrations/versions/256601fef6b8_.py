"""empty message

Revision ID: 256601fef6b8
Revises: 9227577b17f2
Create Date: 2024-12-09 13:23:53.897477

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '256601fef6b8'
down_revision = '9227577b17f2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('submissions', schema=None) as batch_op:
        batch_op.alter_column('team_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('submissions', schema=None) as batch_op:
        batch_op.alter_column('team_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
