from datetime import date

from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class Indices(Base):
    __tablename__ = "indices"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False)
    base_date: Mapped[date] = mapped_column(Date, nullable=False)
    base_value: Mapped[int] = mapped_column(nullable=False)

    constituents: Mapped[list["IndexConstituent"]] = relationship(
        back_populates="index"
    )

    divisors: Mapped[list["IndexDivisor"]] = relationship(
    back_populates="index"
    )