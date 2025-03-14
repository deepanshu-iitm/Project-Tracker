"""empty message

Revision ID: 1f173ef4268d
Revises: 5941f33ff344
Create Date: 2024-12-09 08:55:57.895489

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1f173ef4268d'
down_revision = '5941f33ff344'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('milestones', schema=None) as batch_op:
        batch_op.add_column(sa.Column('submitted_on', sa.DateTime(), nullable=True))

    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.alter_column('project_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.alter_column('project_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('milestones', schema=None) as batch_op:
        batch_op.drop_column('submitted_on')

    # ### end Alembic commands ###
