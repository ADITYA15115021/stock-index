from app.db.database import Base
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column,relationship


class Security(Base):
    __tablename__ = "security"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False)
    exchange: Mapped[str] = mapped_column(String(10), nullable=False)
    series: Mapped[str] = mapped_column(String(10), nullable=False)

    index_constituents: Mapped[list["IndexConstituent"]] = relationship(
    back_populates="security")
